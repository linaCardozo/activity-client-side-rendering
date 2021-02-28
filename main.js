const url =
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

fetch(url)
  .then((res) => res.json())
  .then((res) => {
    let table1 = document.getElementById("table1");
    let table2 = document.getElementById("table2");

    let tblBody1 = document.createElement("tbody");
    let tblBody2 = document.createElement("tbody");

    let l = res.length;

    // Filling the first table with data from URL

    for (let i = 0; i < l; i++) {
      // Table rows
      let row = document.createElement("tr");

      let id = document.createElement("th");
      let event = document.createElement("td");
      let squirrel = document.createElement("td");

      id.textContent = i + 1;
      event.textContent = res[i].events;
      squirrel.textContent = res[i].squirrel;

      if (squirrel.textContent === "true") {
        row.style.backgroundColor = "rgb(244, 165, 165, 0.7)";
        //row.className = "bg-danger";
      }

      row.appendChild(id);
      row.appendChild(event);
      row.appendChild(squirrel);

      tblBody1.appendChild(row);
    }

    let dict = {};

    for (let i = 0; i < l; i++) {
      for (let j = 0; j < res[i].events.length; j++) {
        let item = res[i].events[j];

        if (dict[item] === undefined) {
          dict[item] = [0, 0, 0, 0, 0];
        }

        // False negatives
        if (!res[i].squirrel) {
          dict[item][1]++;
        }
        // True positives
        else {
          dict[item][3]++;
        }
      }
    }

    let keys = Object.keys(dict);

    for (let i = 0; i < l; i++) {
      for (let j = 0; j < keys.length; j++) {
        // False positives
        if (!res[i].events.includes(keys[j]) && res[i].squirrel) {
          dict[keys[j]][2]++;
        }
        // True negatives
        else if (!res[i].events.includes(keys[j]) && !res[i].squirrel) {
          dict[keys[j]][0]++;
        }
      }
    }

    let corr = [];

    // Calculating correlations

    for (let i = 0; i < keys.length; i++) {
      let TN = dict[keys[i]][0];
      let FN = dict[keys[i]][1];
      let FP = dict[keys[i]][2];
      let TP = dict[keys[i]][3];
      dict[keys[i]][4] =
        (TP * TN - FP * FN) /
        Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN));
      corr[i] = dict[keys[i]][4];
    }

    // Sorting the correlations in descending order
    corr.sort((a, b) => b - a);

    // Filling the second table with the events and its correlations

    for (let i = 0; i < keys.length; i++) {
      // Table rows
      let row = document.createElement("tr");

      let id = document.createElement("th");
      let event = document.createElement("td");
      let correlation = document.createElement("td");

      let new_keys = Object.keys(dict);

      id.textContent = i + 1;

      let k = new_keys.find((element) => dict[element][4] === corr[i]);
      event.textContent = k;
      delete dict[k];

      correlation.textContent = corr[i];

      row.appendChild(id);
      row.appendChild(event);
      row.appendChild(correlation);

      tblBody2.appendChild(row);
    }

    table1.appendChild(tblBody1);
    table2.appendChild(tblBody2);
  });
