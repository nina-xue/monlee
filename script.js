console.log("Website loaded")
let isLoading = false;

document.getElementById("submitID").addEventListener("click", function (event) {
    event.preventDefault()
    setButtonInactive("submitID")

    let participantID = document.getElementById("participantID").value.trim();
    console.log(participantID);

    if (participantID.length !== 7) {
        displayError();
        setButtonActive("submitID")

        return;
    }

    callLambda(participantID);
});

function callLambda(participantID) {
    var r = new XMLHttpRequest();
    r.open("GET", "https://i4yrsyy66h.execute-api.eu-west-1.amazonaws.com/dev/" + participantID, true);
    document.getElementById("resultsContainer").innerHTML = "";
    r.onreadystatechange = function () {
        if (r.readyState != 4) {
            return;
        };

        if (r.status != 200) {
            displayError();
            setButtonActive("submitID");
        }

        result = JSON.parse(r.responseText);

        if (result.voucher == "TODO") {
            displayNotYet();
            setButtonActive("submitID");
            return;
        }

        console.log(result);
        displayDonation(result);
        setButtonActive("submitID")

        if (result.voucher !== "NONE") {
            displayVoucher(result);
        }
    };
    r.send();
}

function addRow(contentString) {
    let doc = document.getElementById("resultsContainer");
    let row = document.createElement('div');
    row.classList.add("row");

    let column = document.createElement("div");
    column.classList.add("one-full");
    column.classList.add("column");

    column.innerHTML = contentString.trim();
    row.appendChild(column);
    doc.appendChild(row);
}

function displayDonation(result) {
    let resultContent = `      
        <b>Donated amount:</b> ${result.donated_amount}  to charity ${result.charity}<br>
        <b>Full list of donations:</b> <br>
    `
    addRow(resultContent);
}

function displayVoucher(result) {
    let resultContent = `      
        <b>Your voucher code on Amazon:</b> ${result.voucher}<br>
    `
    addRow(resultContent);
}

function displayError() {
    let resultContent = `      
        There was an error retrieving your results. Please make sure you entered the correct code. <br>
        The code consists of 2 letters and 5 numbers, for example ab12345
    `
    addRow(resultContent);  
}

function displayNotYet() {
    let resultContent = `      
        We are sorry but your results are not in yet, please try again in a couple of days.
    `
    addRow(resultContent);  
}

function setButtonActive(buttonID) {
    document.getElementById(buttonID).className = "button-primary";
    document.getElementById(buttonID).value = "Get results";
    document.getElementById(buttonID).disabled = false;
    isLoading = false;
    return;
}

function setButtonInactive(buttonID) {
    document.getElementById(buttonID).className = "button";
    document.getElementById(buttonID).value = "Loading...";
    document.getElementById(buttonID).disabled = true;
    isLoading = true; 
    return;
}