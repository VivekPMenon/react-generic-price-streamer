export function generateRandomString(len: number) {
  return Array.apply(0, Array(len))
    .map(function () {
      return (function (charset) {
        return charset.charAt(
          Math.floor(Math.random() * charset.length)
        );
      })(
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      );
    })
    .join('');
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}