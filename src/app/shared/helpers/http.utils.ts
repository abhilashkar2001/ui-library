import { HttpParams } from '@angular/common/http';

export function appendFilterParam(paramsObj: {
  [key: string]: string | number | boolean | string[] | number[];
}): HttpParams {
  let params = new HttpParams();
  // Dynamically append query parameters
  if (paramsObj)
    Object.keys(paramsObj).forEach((key) => {
      if (
        !key ||
        !paramsObj[key] ||
        paramsObj[key]?.toString()?.includes('All')
      )
        return;
      params = params.set(key, paramsObj[key] as string);
    });

  return params;
}
