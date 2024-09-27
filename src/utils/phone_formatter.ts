export default function phone_formatter(number: string) {
  return number.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}
