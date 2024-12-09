import * as moment from "moment";
import { StaticData } from "../models/static.constant";

export function getIndexBy(
  array: Array<{}> | any,
  { name, value }: any
): number {
  for (let i = 0; i < array.length; i++) {
    if (array[i][name] === value) {
      return i;
    }
  }
  return -1;
}

function currentYPosition() {
  if (!window) {
    return;
  }
  // Firefox, Chrome, Opera, Safari
  if (window.pageYOffset) return window.pageYOffset;
  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop)
    return document.documentElement.scrollTop;
  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) return document.body.scrollTop;
  return 0;
}

function elmYPosition(elm: any) {
  var y = elm.offsetTop;
  var node = elm;
  while (node.offsetParent && node.offsetParent !== document.body) {
    node = node.offsetParent;
    y += node.offsetTop;
  }
  return y;
}

export function scrollTo(selector: any) {
  var elm = document.querySelector(selector);
  if (!selector || !elm) {
    return;
  }
  var startY: any = currentYPosition();
  var stopY: any = elmYPosition(elm);
  var distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    window.scrollTo(0, stopY);
    return;
  }
  var speed = Math.round(distance / 50);
  if (speed >= 20) speed = 20;
  var step = Math.round(distance / 25);
  var leapY = stopY > startY ? startY + step : startY - step;
  var timer = 0;
  if (stopY > startY) {
    for (var i = startY; i < stopY; i += step) {
      setTimeout(
        (function (leapY) {
          return () => {
            window.scrollTo(0, leapY);
          };
        })(leapY),
        timer * speed
      );
      leapY += step;
      if (leapY > stopY) leapY = stopY;
      timer++;
    }
    return;
  }
  for (let i: any = startY; i > stopY; i -= step) {
    setTimeout(
      (function (leapY) {
        return () => {
          window.scrollTo(0, leapY);
        };
      })(leapY),
      timer * speed
    );
    leapY -= step;
    if (leapY < stopY) leapY = stopY;
    timer++;
  }
  return false;
}
export const DEFAULT_LOCALE = {
  country: "United States",
  dateFormat: "MM/DD/YYYY",
  locale: "en-US",
  currency: "USD"
};
export function pluckOnlyDate(date: any) {
  return moment(date).format("YYYY-MM-DD");
}
export interface FilterBy {
  createdBy: string;
  createdDate: string;
  searchValue: string;
  newFilter: string;
  authStatus: string;
  recordStatus: string;
}

export function removeSpecCharsOnly(separator: any, val: any) {
  let value = val?.toString();
  const expression = `[${separator}]`;
  const customRegx = new RegExp(expression, "g");
  const money = value?.replace(customRegx, "");
  console.log("check", money);

  return Number(money);
}

export function findCurrency(currencyCode: any) {
  return StaticData.currencyList[currencyCode];
}

export function handleDownload(data: any, pdfName: any) {
  const blob = new Blob([data], { type: "application/octet-stream" });
  const url = window.URL.createObjectURL(blob);

  // Create a link element and simulate a click to trigger the download
  const link = document.createElement("a");
  link.href = url;
  link.download = `${pdfName}.pdf`;
  document.body.appendChild(link);
  link.click();

  // Cleanup the link element
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
