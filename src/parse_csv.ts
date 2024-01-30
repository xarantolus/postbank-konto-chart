import { parse } from 'papaparse';

export interface AccountData {
	name: string,
	account_number: string,
	iban: string,
	currency: string,
}

export interface Payment {
	date: Date,
	type: string,
	other_party: string,
	message: string,
	iban: string,
	amount: number,
}

export interface FinancialData {
	account: AccountData,

	start_date: Date,
	end_date: Date,

	initial_balance: number,
	final_balance: number,

	payments: Payment[],
}


// D.M.YYYY, but in current time zone
function parseDate(date: string): Date {
	let parts = date.split(".");
	if (parts.length != 3) {
		throw `Unsupported date format: ${date}`;
	}
	let day = parseInt(parts[0]);
	let month = parseInt(parts[1]) - 1;
	let year = parseInt(parts[2]);

	return new Date(Date.UTC(year, month, day, 0, 0));
}

function parseKontostand(line: string): number {
	// A line like "Letzter Kontostand;;;;1.234,56;EUR" or "Kontostand;;;;1.234,56;EUR"
	let parts = line.split(";");
	if (parts.length != 6) {
		throw `Unsupported Kontostand line: ${line}`;
	}

	if (!parts[0].includes("Kontostand")) {
		throw `Unsupported Kontostand line: ${line}`;
	}

	let amount = parts[4].replace(".", "").replace(",", ".");
	return parseFloat(amount);
}

export function fromCSV(input: string): FinancialData {
	if (!input.startsWith("Umsätze")) {
		throw "Unexpected file header";
	}

	// Remove first line
	let start = input.indexOf("\n");
	let data = input.substring(start + 1);

	// Split header and payment data
	let parts = data.trim().split("\n\n");
	if (parts.length != 2) {
		throw `Expected header and payment data, but got ${parts.length} parts instead of 2`;
	}

	let account_data = parse(parts[0], {
		delimiter: ';',
		header: true,
	})
	if (account_data.data.length != 1) {
		throw "Unsupported file: Expected exactly one bank account header"
	}
	let payment = account_data.data[0];

	// The next few lines, the start of parts[1], is the date range in e.g. format "1.1.2020 - 31.12.2020"
	let paymentInfoLines = parts[1].split("\n");

	let date_range_str = paymentInfoLines.shift();
	let date_range = date_range_str.split("-");
	if (date_range.length != 2) {
		throw "Unsupported file: Expected exactly two dates in the date range"
	}
	// parse dates in current time zone, but make sure to set the time to midnight
	let start_date = date_range[0].trim();
	let end_date = date_range[1].trim();

	let initial_balance = parseKontostand(paymentInfoLines.shift());
	// Line 2 contains some sentence not important for us
	paymentInfoLines.shift();

	let final_balance = parseKontostand(paymentInfoLines[paymentInfoLines.length - 1]);
	paymentInfoLines.pop();

	let joined = paymentInfoLines.join("\n");

	// Now again use the csv parser
	let payment_data = parse(joined, {
		delimiter: ';',
		header: true,
	})

	// Make sure fields contains the expected fields
	let fields = payment_data.meta.fields;
	const expected_fields = ["Buchungstag", "Umsatzart", "Begünstigter / Auftraggeber", "Verwendungszweck", "IBAN / Kontonummer", "Betrag"];
	for (let expected_field of expected_fields) {
		if (!fields.includes(expected_field)) {
			throw `Unsupported file: Expected field ${expected_field} in payment data, but it was not found`;
		}
	}

	let payments: Payment[] = [];
	for (let payment of payment_data.data) {
		let date = parseDate(payment["Buchungstag"]);
		let type = payment["Umsatzart"];
		let other_party = payment["Begünstigter / Auftraggeber"];
		let message = payment["Verwendungszweck"];
		let iban = payment["IBAN / Kontonummer"];
		let amount = parseFloat(payment["Betrag"].replace(".", "").replace(",", "."));

		payments.push({
			date,
			type,
			other_party,
			message,
			iban,
			amount,
		});
	}

	return {
		account: {
			name: payment["Konto"],
			account_number: payment["Filial-/Kontonummer"],
			iban: payment["IBAN"],
			currency: payment["Währung"],
		},
		start_date: parseDate(start_date),
		end_date: parseDate(end_date),

		initial_balance,
		final_balance,

		payments,
	};
}
