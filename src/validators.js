export function validateNumberType(type) {
  const validTypes = ['p', 'f', 'e', 'r'];
  
  if (!type) {
    return 'Number type is required';
  }

  if (!validTypes.includes(type)) {
    return `Invalid number type. Valid types are: ${validTypes.join(', ')}`;
  }

  return null;
}