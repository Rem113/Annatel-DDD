export default abstract class Failure {
	private readonly message: string
	private readonly payload?: any

	constructor(message: string, payload?: any) {
		this.message = message
		this.payload = payload
	}

	unwrap(): any {
		return {
			message: this.message,
			payload: this.payload,
		}
	}
}
