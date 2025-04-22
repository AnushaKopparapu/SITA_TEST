function getLicensePlate(n) {
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // From 0 to 999999
  if (n < 1_000_000) {
    return n.toString().padStart(6, '0');
  }

  let index = n - 1_000_000;

  // letter count possibilities
  for (let letterCount = 1; letterCount <= 6; letterCount++) {
    const digitCount = 6 - letterCount;
    const blockSize = Math.pow(10, digitCount) * Math.pow(26, letterCount);

    if (index < blockSize) {
      let numberPart = '';
      if (digitCount > 0) {
        numberPart = Math.floor(index % Math.pow(10, digitCount)).toString().padStart(digitCount, '0');
      }
      let letterIndex = Math.floor(index / Math.pow(10, digitCount));

      // Convert to base-26 letters
      let letterPart = '';
      for (let i = 0; i < letterCount; i++) {
        letterPart = LETTERS[letterIndex % 26] + letterPart;
        letterIndex = Math.floor(letterIndex / 26);
      }

      return numberPart + letterPart;
    } else {
      index -= blockSize;
    }
  }

  throw new Error("Index exceeds plate capacity");
}


console.log(getLicensePlate(999999));    // "999999"
console.log(getLicensePlate(1000000));   // "00000A"
console.log(getLicensePlate(1000001));   // "00001A"
console.log(getLicensePlate(3600000));   // "0000AA"

  
