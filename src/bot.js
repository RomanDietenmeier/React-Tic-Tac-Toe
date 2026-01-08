const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function is_game_over(field) {
  let game_over = null;
  for (const line of lines) {
    // console.log("line", line);

    if (
      field[line[0]] != "-" &&
      field[line[0]] &&
      field[line[0]] == field[line[1]] &&
      field[line[0]] == field[line[2]]
    ) {
      game_over = field[line[0]];
      break;
    }
  }
  if (!game_over) {
    let field_is_full = true;
    for (let i = 0; i < 9; i++) {
      if (field[i] == "-") {
        field_is_full = false;
        break;
      }
    }
    if (field_is_full) {
      return "full";
    }
  }
  return game_over;
}

function find_winning_idices(field) {
  const idices = [];
  for (const line of lines) {
    const map = { X: 0, O: 0 };
    for (let i = 0; i < 3; i++) {
      if (field[line[i]] == "X") {
        map["X"] = map["X"] + 1;
      } else if (field[line[i]] == "O") {
        map["O"] = map["O"] + 1;
      } else {
        map["missing_idx"] = line[i];
      }
    }

    if (map["X"] >= 2 && map["O"] <= 0) {
      idices.push(["X", map["missing_idx"]]);
    } else if (map["O"] >= 2 && map["X"] <= 0) {
      idices.push(["O", map["missing_idx"]]);
    }
  }
  //   console.log("idices", idices, "field", field);
  return idices;
}

function getShuffledFieldIteration() {
  const array = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export function translate_react_field(field) {
  const field_copy = structuredClone(field);
  for (let i = 0; i < 9; i++) {
    if (field_copy[i] == null) {
      field_copy[i] = "-";
    }
  }
  return field_copy;
}

export function get_bot_move(field, player, first_idx = -1) {
  //   console.log("count", count++);

  const game_over = is_game_over(field);
  if (game_over != null) {
    return [game_over, first_idx, field];
  }
  const winning_idices = find_winning_idices(field);
  const field_copy = structuredClone(field);
  const next_player = player == "X" ? "O" : "X";

  if (winning_idices.length >= 0) {
    for (const [winning_player, idx] of winning_idices) {
      if (winning_player == player) {
        return [winning_player, first_idx == -1 ? idx : first_idx, field];
      }
      field_copy[idx] = player;
      const res = get_bot_move(
        field_copy,
        next_player,
        first_idx == -1 ? idx : first_idx
      );
      return res;
    }
  }
  for (const idx of getShuffledFieldIteration()) {
    if (field_copy[idx] != "-") {
      continue;
    }
    field_copy[idx] = player;
    const res = get_bot_move(
      field_copy,
      next_player,
      first_idx == -1 ? idx : first_idx
    );
    return res;
  }
}
