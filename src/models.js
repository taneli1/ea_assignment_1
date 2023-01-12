class Work {
  #balance = (0).toFixed(2)

  getBalance = () => this.#balance

  work = () => {
    this.#balance = (parseFloat(this.#balance) + 100.0).toFixed(2)
  }

  deductBalance = (amount) => {
    this.#balance = (this.#balance - parseFloat(amount)).toFixed(2)
  }
}

class Bank {
  #balance = (0).toFixed(2)
  #loan = (0).toFixed(2)

  getBalance = () => this.#balance

  /**
   * Repays an outstanding loan up to 10% automatically if present.
   */
  deposit = (amount) => {
    let amnt = parseFloat(amount)

    if (this.hasOutStandingLoan()) {
      const payBackAmount = this.#calculatePaybackAmount(amnt)
      this.#loan = (parseFloat(this.#loan) - payBackAmount).toFixed(2)
      amnt = parseFloat(amnt) - payBackAmount
    }

    this.#addToBalance(amnt)
  }

  hasOutStandingLoan = () => this.#loan != 0
  getOutstandingLoan = () => this.#loan

  /**
   * Loan amount will be added to balance if granted.
   * @returns boolean, whether the loan was granted.
   */
  requestLoan = (loanAmount) => {
    const fAmount = parseFloat(loanAmount)
    if (isNaN(fAmount)) {
      return false
    }
    if (this.#loan > 0) {
      return false
    }
    if (fAmount > this.#balance * 2) {
      return false
    }

    this.#addToBalance(fAmount)
    this.#loan = fAmount.toFixed(2)
    return true
  }

  repayLoan = (amount) => {
    const paidAmount = parseFloat(amount)

    const leftOverAmount = paidAmount - parseFloat(this.#loan)
    if (leftOverAmount > 0) {
      this.#loan = (0).toFixed(2)
      this.#addToBalance(leftOverAmount)
      return
    }

    // Repay amount less than current loan, no balance updt
    this.#loan = (parseFloat(this.#loan) - paidAmount).toFixed(2)
  }

  deductBalance = (amount) => {
    this.#balance = (this.#balance - parseFloat(amount)).toFixed(2)
  }

  #calculatePaybackAmount = (fromAmount) => {
    const max = (parseFloat(fromAmount) * 0.1).toFixed(2)
    if (max > this.#loan) {
      return this.#loan
    }
    return max
  }

  #addToBalance = (amount) => {
    this.#balance = (parseFloat(this.#balance) + parseFloat(amount)).toFixed(2)
  }
}

class ShopAPI {
  static async getData() {
    try {
      const result = await fetch(this.baseUrl() + "/computers")
      const data = await result.json()
      return data
    } catch (e) {
      console.error("Failed to fetch: ", e)
      return []
    }
  }

  static baseUrl() {
    return "https://hickory-quilled-actress.glitch.me"
  }
}

/**
 * Handles money traffic
 */
class TransactionFacilitator {
  static bankDeposit = (workObject, bankObject) => {
    const amount = workObject.getBalance()
    workObject.deductBalance(amount)
    bankObject.deposit(amount)
  }

  static bankLoanPayment = (workObject, bankObject) => {
    const amount = workObject.getBalance()
    workObject.deductBalance(amount)
    bankObject.repayLoan(amount)
  }

  /**
   * "Purchases" a product, returns true if successfully completed.
   */
  static purchaseProduct = (bankObject, productPrice) => {
    const price = parseFloat(productPrice)
    const balance = bankObject.getBalance()

    if (productPrice > balance) {
      return false
    }

    bankObject.deductBalance(price)
    return true
  }
}
