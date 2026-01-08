let field = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
field[4] = "X";
field[0] = "O";
field[6] = "X";
field[2] = "O";
field[1] = "X";
field[7] = "O";
field[3] = "X";
field[5] = "O";
field[8] = "X";
function rotate_field(field) {
  return [
    field[6],
    field[3],
    field[0],
    field[7],
    field[4],
    field[1],
    field[8],
    field[5],
    field[2],
  ];
}

function mirrorVertical_field(field) {
  return [
    field[2],
    field[1],
    field[0],
    field[5],
    field[4],
    field[3],
    field[8],
    field[7],
    field[6],
  ];
}

function mirrorHorizontal_field(field) {
  return [
    field[6],
    field[7],
    field[8],
    field[3],
    field[4],
    field[5],
    field[0],
    field[1],
    field[2],
  ];
}

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
  for (line of lines) {
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

function get_field_depth(field) {
  let depth = 0;
  for (let i = 0; i < 9; i++) {
    if (field[i] != "-") {
      depth += 1;
    }
  }
  return depth;
}

function field_to_str(field) {
  txt = "";
  for (element of field) {
    txt += element;
  }
  return txt;
}

function find_winning_idices(field) {
  const idices = [];
  for (line of lines) {
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

// console.log("find_winning_idices", find_winning_idices(field));

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

// let count = 0;
function get_best_moves(field, player, first_idx = -1) {
  //   console.log("count", count++);

  const game_over = is_game_over(field);
  if (game_over != null) {
    return [game_over, first_idx, field];
  }
  const winning_idices = find_winning_idices(field);
  const field_copy = structuredClone(field);
  const next_player = player == "X" ? "O" : "X";

  if (winning_idices.length >= 0) {
    for ([winning_player, idx] of winning_idices) {
      if (winning_player == player) {
        return [winning_player, first_idx == -1 ? idx : first_idx, field];
      }
      field_copy[idx] = player;
      const res = get_best_moves(
        field_copy,
        next_player,
        first_idx == -1 ? idx : first_idx
      );
      return res;
    }
  }
  for (idx of getShuffledFieldIteration()) {
    field_copy[idx] = player;
    const res = get_best_moves(
      field_copy,
      next_player,
      first_idx == -1 ? idx : first_idx
    );
    return res;
  }
}

console.log("field", field);
console.log("get_best_moves()", get_best_moves(field, "X"));
