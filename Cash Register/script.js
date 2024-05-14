let price = 1.87;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

const cash = document.getElementById("cash");
const changeDue = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");

const calculateChange = (amountPaid, price, cid) => {
  let change = amountPaid - price;
  let changeDue = [];
  let totalCid = cid.reduce((acc, curr) => acc + curr[1], 0);

  if (change === totalCid) {
    // Special case where the change due matches the total CID
    return { status: "CLOSED", change: cid.filter((coin) => coin[1] > 0) };
  }

  let changeRemaining = change;
  let cidReverse = cid.slice().reverse();

  cidReverse.forEach((coin) => {
    let coinName = coin[0];
    let coinTotal = coin[1];
    let coinValue = {
      PENNY: 0.01,
      NICKEL: 0.05,
      DIME: 0.1,
      QUARTER: 0.25,
      ONE: 1,
      FIVE: 5,
      TEN: 10,
      TWENTY: 20,
      "ONE HUNDRED": 100,
    }[coinName];
    let coinAmount = 0;

    while (changeRemaining >= coinValue && coinTotal > 0) {
      changeRemaining -= coinValue;
      coinTotal -= coinValue;
      coinAmount += coinValue;
      changeRemaining = Math.round(changeRemaining * 100) / 100; // Avoid floating point precision issues
    }

    if (coinAmount > 0) {
      changeDue.push([coinName, coinAmount]);
    }
  });

  if (changeRemaining > 0) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  } else if (changeDue.length > 0) {
    return { status: "OPEN", change: changeDue };
  }
};

purchaseBtn.addEventListener("click", () => {
  let amountPaid = parseFloat(cash.value);
  if (amountPaid < price) {
    alert("Customer does not have enough money to purchase the item");
  } else if (amountPaid == price) {
    changeDue.textContent = "No change due - customer paid with exact cash";
  } else {
    let result = calculateChange(amountPaid, price, cid);
    if (result.status === "CLOSED") {
      let changeText = "Status: CLOSED ";
      result.change.forEach((coin) => {
        changeText += `${coin[0]}: $${coin[1].toFixed(2)} `;
      });
      changeDue.textContent = changeText.trim();
    } else if (result.status === "INSUFFICIENT_FUNDS") {
      changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
    } else if (result.status === "OPEN") {
      let changeText = "Status: OPEN ";
      result.change.forEach((coin) => {
        changeText += `${coin[0]}: $${coin[1].toFixed(2)} `;
      });
      changeDue.textContent = changeText.trim();
    }
  }
});
