let results;
window.onload = () => fetchResultsJson();

const fetchResultsJson = () => {
  fetch("./results.json")
    .then((response) => response.json())
    .then(async (data) => {
      results = data;
      await populateYearDropdown();
      await yearDropdownChange();
    });
};

const populateYearDropdown = async () => {
  return new Promise((resolve) => {
    const dropdown = document.getElementById("yearDropdown");
    dropdown.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Select";
    defaultOption.disabled = true;
    dropdown.appendChild(defaultOption);

    results.forEach((result, index) => {
      const option = document.createElement("option");
      option.value = result.year.toString();
      option.text = result.year.toString();
      if (index === 0) {
        option.selected = true;
      }
      dropdown.appendChild(option);
    });
    resolve();
  });
};

const yearDropdownChange = () => {
  return new Promise(async (resolve) => {
    var selectedYear = document.getElementById("yearDropdown").value;
    const selectedYearData = results.find(
      (yearData) => yearData.year.toString() === selectedYear.toString()
    );
    if (selectedYearData) {
      const gamemodeJump = document.getElementById("gamemodeJump");
      gamemodeJump.innerHTML = "";
      selectedYearData.gamemodes.forEach((gamemode) => {
        const link = document.createElement("a");
        link.href = `#${gamemode.name}`;
        link.className = "btn btn-light";
        link.textContent = gamemode.name;
        const div = document.createElement("div");
        div.className = "center textpad";
        div.appendChild(link);
        gamemodeJump.appendChild(div);
      });
      const content = await generateContent(selectedYearData);
      document.getElementById("gamemodeResults").innerHTML = content;
    }
    resolve();
  });
};

const toggleBracket = (bracketId, spanElement) => {
  var bracketIframe = document.getElementById(bracketId);
  if (bracketIframe.classList.contains("d-none")) {
    bracketIframe.classList.remove("d-none");
    spanElement.innerHTML = "expand_less";
  } else {
    bracketIframe.classList.add("d-none");
    spanElement.innerHTML = "expand_more";
  }
};

const generateContent = (results) => {
  return new Promise((resolve) => {
    const contentPromises = results.gamemodes.map((gamemode) => {
      return new Promise((gamemodeResolve) => {
        const content = `<div id="${gamemode.name}" class="row">
          <div class="col-sm-12 toppad textdivmargin">
            <h1 class="center textpad">
              ${results.year} ${gamemode.name} (${gamemode.playerCount} players)
            </h1>
            <div class="row">
            <div class="col-sm-4 textdivmargin nopad center order-2 order-sm-1">
            <img src="../media/tanks/${
              gamemode.secondPlace.winner
            }.png" class="img-fluid img75" />
            <h2 class="textpad center">2nd Place</h2>
            <p class="textpad center">
                ${gamemode.secondPlace.winner}
                <br />
                ${
                  gamemode.secondPlace.prize !== ""
                    ? `${gamemode.secondPlace.prize}`
                    : "No Prize"
                }
            </p>
        </div>
        <div class="col-sm-4 textdivmargin center divpad order-1 order-sm-2">
            <img src="../media/tanks/${
              gamemode.firstPlace.winner
            }.png" class="img-fluid" />
            <h2 class="textpad center">1st Place</h2>
            <p class="textpad center">
                ${gamemode.firstPlace.winner}
                <br />
                ${
                  gamemode.firstPlace.prize !== ""
                    ? `${gamemode.firstPlace.prize}`
                    : "No Prize"
                }
            </p>
        </div>
        <div class="col-sm-4 textdivmargin nopad center order-3 order-sm-3">
            <img src="../media/tanks/${
              gamemode.thirdPlace.winner !== ""
                ? gamemode.thirdPlace.winner
                : "TTOC_question_tank"
            }.png" class="img-fluid img50" />
            <h2 class="textpad center">3rd Place</h2>
            <p class="textpad center">
                ${
                  gamemode.thirdPlace.winner !== ""
                    ? `${gamemode.thirdPlace.winner}`
                    : "Undetermined"
                }
                <br />
                ${
                  gamemode.thirdPlace.prize !== ""
                    ? `${gamemode.thirdPlace.prize}`
                    : "No Prize"
                }
            </p>
        </div>
            </div>
            <div class="row">
              <div class="col-sm-12 textdivmargin center botpad">
                <p>
                    <span class="material-symbols-outlined center textpad iconLarge pointer"
                    onclick="toggleBracket('bracket-${gamemode.name}', this)">
                        expand_less
                    </span>
              </div>
            </div>
          </div>
          <div id="bracket-${gamemode.name}" class="col-sm-12 nopad">
            <iframe
              src="${gamemode.bracketsURL}"
              width="100%"
              style="min-height: 600px; height: 100%"
              frameborder="0"
              class="grab"
            ></iframe>
          </div>
        </div>`;

        gamemodeResolve(content);
      });
    });

    Promise.all(contentPromises).then((contents) => {
      resolve(contents.join(""));
    });
  });
};
