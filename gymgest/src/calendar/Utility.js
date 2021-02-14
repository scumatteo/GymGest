export function minHour(dates) {
  let min = 23;
  for (const date in dates) {
    let hour = parseInt(dates[date].initialHour.substring(0, 2));
    if (hour < min) {
      min = hour;
    }
  }
  if (min < 10) {
    return "0" + min + ":00";
  }
  return min + ":00";
}

export function maxHour(dates) {
  let max = 0;
  for (const date in dates) {
    let hour = parseInt(dates[date].finalHour.substring(0, 2));
    if (hour > max) {
      max = hour;
    }
  }

  if (max < 10) {
    return "0" + max + ":00";
  }
  return max + ":00";
}

export function composeDateTime(date, hour) {
  return date + "T" + hour;
}

export function getNameByDay(day) {
  switch (day) {
    case 0:
      return "Domenica";

    case 1:
      return "Lunedì";

    case 2:
      return "Martedì";

    case 3:
      return "Mercoledì";

    case 4:
      return "Giovedì";

    case 5:
      return "Venerdì";

    case 6:
      return "Sabato";

    default:
      return null;
  }
}

export function getDayByName(name) {
  switch (name) {
    case "Domenica":
      return 0;

    case "Lunedì":
      return 1;

    case "Martedì":
      return 2;

    case "Mercoledì":
      return 3;

    case "Giovedì":
      return 4;

    case "Venerdì":
      return 5;

    case "Sabato":
      return 6;

    default:
      return null;
  }
}

export function getStringDate(date) {
  let dateStr = "";

  dateStr += getNameByDay(date.day)

  dateStr += ": " + date.initialHour + " - " + date.finalHour + "\n";
  return dateStr;
}
