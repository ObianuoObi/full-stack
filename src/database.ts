import { Pool } from "pg"
import { User } from "./server"
import bcrypt from "bcrypt"

const pool = new Pool({
	user: "obi",
	host: "localhost",
	database: "obi",
	password: "",
	port: 5432,
})

export const blockUserInDatabase = async (userId: string) => {
	try {
		await pool.query("UPDATE user_details SET blocked = true WHERE id = $1", [
			userId,
		])
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const confirmPaymentInDatabase = async (paymentId: string) => {
	try {
		await pool.query("UPDATE payments SET status = 'confirmed' WHERE id = $1", [
			paymentId,
		])
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const createPairing = async (userId: string, adminId: string) => {
	try {
		await pool.query(
			"INSERT INTO pairings(payer_id, payee_id) VALUES($1, $2)",
			[userId, adminId]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const createReferral = async (userId: string, referralId: string) => {
	try {
		await pool.query(
			"INSERT INTO referrals(referrer_id, referred_id) VALUES($1, $2)",
			[userId, referralId]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const createTransaction = async (userId: string, amount: number) => {
	try {
		await pool.query(
			"INSERT INTO investments(user_id, amount) VALUES($1, $2)",
			[userId, amount]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const createWithdrawal = async (userId: string, amount: number) => {
	try {
		await pool.query(
			"INSERT INTO withdrawals(user_id, amount) VALUES($1, $2)",
			[userId, amount]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const depositMoney = async (deposit: number, phone_number: string) => {
	try {
		await pool.query(
			"UPDATE user_details SET balance = balance + $1 WHERE phone_number = $2",
			[deposit, phone_number]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const getDepositById = async (depositId: string) => {
	try {
		const result = await pool.query("SELECT * FROM investments WHERE id = $1", [
			depositId,
		])
		return result.rows[0]
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const getPairs = async (userId: string) => {
	try {
		const result = await pool.query(
			"SELECT * FROM pairings WHERE payer_id = $1 OR payee_id = $1",
			[userId]
		)
		return result.rows
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const getPairedUsers = async (userId: string) => {
	try {
		const result = await pool.query(
			"SELECT * FROM user_details WHERE id IN (SELECT user_id2 FROM user_pairs WHERE user_id1 = $1)",
			[userId]
		)
		return result.rows
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const getUser = async (userId: string) => {
	try {
		const result = await pool.query(
			"SELECT * FROM user_details WHERE id = $1",
			[userId]
		)
		return result.rows[0]
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const getUserByPhoneNumber = async (phone_number: string) => {
	try {
		const result = await pool.query(
			"SELECT * FROM user_details WHERE phone_number = $1",
			[phone_number]
		)
		return result.rows[0]
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const getUsers = async () => {
	try {
		const result = await pool.query(
			"SELECT id, first_name, last_name, balance, referral_link, phone_number FROM user_details;"
		)
		return result.rows
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const pairUsers = async (userId1: string, userId2: string) => {
	try {
		await pool.query(
			"INSERT INTO user_pairs (user_id1, user_id2) VALUES ($1, $2)",
			[userId1, userId2]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const restoreUserInDatabase = async (userId: string) => {
	try {
		await pool.query("UPDATE user_details SET blocked = false WHERE id = $1", [
			userId,
		])
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const saveUserToDatabase = async (user: User) => {
	try {
		const hashedPassword = await bcrypt.hash(user.password, 12)
		console.log("Hashed Password to be saved:", hashedPassword) // Log the hashed password
		const result = await pool.query(
			"INSERT INTO user_details (first_name, last_name, phone_number, password, balance) VALUES ($1, $2, $3, $4, $5) RETURNING *",
			[user.first_name, user.last_name, user.phone_number, hashedPassword, 0.0]
		)
		return result.rows[0]
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const updatePairWithProofOfPayment = async (
	pairId: string,
	proofOfPayment: string
) => {
	try {
		await pool.query(
			"UPDATE pairings SET proof_of_payment = $1 WHERE id = $2",
			[proofOfPayment, pairId]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const updateUserBalance = async (userId: string, newBalance: number) => {
	try {
		await pool.query("UPDATE user_details SET balance = $1 WHERE id = $2", [
			newBalance,
			userId,
		])
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const updateUserDetails = async (
	userId: string,
	details: {
		first_name: string
		last_name: string
		middle_name?: string
		bank_name?: string
		account_number?: string
	}
) => {
	const { first_name, last_name, middle_name, bank_name, account_number } =
		details
	try {
		await pool.query(
			"UPDATE user_details SET first_name = $1, last_name = $2, middle_name = $3, bank_name = $4, account_number = $5 WHERE id = $6",
			[first_name, last_name, middle_name, bank_name, account_number, userId]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export const withdrawMoney = async (withdraw: number, phone_number: string) => {
	try {
		await pool.query(
			"UPDATE user_details SET balance = balance - $1 WHERE phone_number = $2",
			[withdraw, phone_number]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
}
