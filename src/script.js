const txtWorkBalance = document.getElementById("card-work-txt-balance")
const txtBankBalance = document.getElementById("card-bank-txt-balance")
const txtLoanBalance = document.getElementById("card-bank-txt-loan")
const containerLoanAmount = document.getElementById("card-bank-container-loan")
const btnRepayLoan = document.getElementById("card-work-btn-repay-loan")

const bank = new Bank()
const work = new Work()

const init = () => {
  setupWorkCard()
  setupBankCard()
  setupShop()
}

const setupWorkCard = () => {
  const btnWork = document.getElementById("card-work-btn-work")
  const btnBankTransfer = document.getElementById("card-work-btn-bank")

  // Perform work
  btnWork.addEventListener("click", () => {
    work.work()
    refreshBalanceUI()
  })

  // Deposit to bank
  btnBankTransfer.addEventListener("click", () => {
    TransactionFacilitator.bankDeposit(work, bank)
    refreshBalanceUI()
  })

  // Payback loan
  btnRepayLoan.addEventListener("click", () => {
    TransactionFacilitator.bankLoanPayment(work, bank)
    refreshBalanceUI()
  })
}

const setupBankCard = () => {
  const btnLoan = document.getElementById("card-bank-btn-loan")

  // Loan request
  btnLoan.addEventListener("click", () => {
    const amount = window.prompt("Enter the desired loan amount.")
    const loanResult = bank.requestLoan(amount)
    if (loanResult) {
      alert(`Successfully loaned ${amount}€.`)
    } else {
      alert(`Failed to loan ${amount}€.`)
    }
    refreshBalanceUI()
  })
}

const setupShop = async () => {
  const productContainer = document.getElementById("product-container")
  const productSelect = document.getElementById("product-select")
  const productFeatureList = document.getElementById("product-feature-list")
  const productName = document.getElementById("product-name")
  const productDesc = document.getElementById("product-description")
  const productImage = document.getElementById("product-image")
  const productPrice = document.getElementById("product-price")
  const btnPurchaseProduct = document.getElementById("btn-order-product")

  const products = await ShopAPI.getData()

  // Add as options
  products.forEach((it) => {
    const option = document.createElement("option")
    option.innerText = it.title
    option.value = it.id

    productSelect.appendChild(option)
  })

  btnPurchaseProduct.addEventListener("click", () => {
    const productId = productSelect.options[productSelect.selectedIndex].value
    const product = products.find((it) => it.id == productId)

    const result = TransactionFacilitator.purchaseProduct(bank, product.price)
    if (result) {
      alert("Successfully bought the computer!")
    } else {
      alert("Failed to buy the computer. You do not have the required funds.")
    }
    refreshBalanceUI()
  })

  productSelect.addEventListener("change", (e) => {
    const productId = e.target.value
    const product = products.find((it) => it.id == productId)
    updateShopUI(product)
    updateProductCard(product)
  })

  // Render feature list
  const updateShopUI = (product) => {
    productFeatureList.replaceChildren()
    product.specs.forEach((it) => {
      const li = document.createElement("li")
      li.innerText = it
      li.classList = "text-sm text-grey-500"
      productFeatureList.appendChild(li)
    })
    productContainer.classList.remove("hidden")
  }

  const updateProductCard = (product) => {
    productName.innerText = product.title
    productImage.src = ShopAPI.baseUrl() + `/${product.image}`
    productDesc.innerText = product.description
    productPrice.innerText = product.price + "€"
  }
}

const refreshBalanceUI = () => {
  txtWorkBalance.innerText = work.getBalance() + "€"
  txtBankBalance.innerText = bank.getBalance() + "€"

  if (bank.hasOutStandingLoan()) {
    txtLoanBalance.innerText = bank.getOutstandingLoan() + "€"
    containerLoanAmount.classList.remove("hidden")
    btnRepayLoan.classList.remove("hidden")
  } else {
    containerLoanAmount.classList.add("hidden")
    btnRepayLoan.classList.add("hidden")
  }
}

init()
