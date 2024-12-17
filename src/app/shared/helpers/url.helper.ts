export function getQueryParam(
  prop?: string,
): Record<string, string> | string | undefined {
  const params: Record<string, string> = {};
  const search = decodeURIComponent(
    window.location.href.slice(window.location.href.indexOf('?') + 1),
  );
  const definitions = search.split('&');
  definitions.forEach(function (val) {
    const parts = val.split('=', 2);
    if (parts.length === 2 && parts[0] && parts[1]) {
      params[parts[0]] = parts[1];
    }
  });
  return prop && prop in params ? params[prop] : params;
}
