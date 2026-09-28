export interface GreetOptions {
  /** Name of the person or thing to greet. */
  name: string;
}

/**
 * Builds a greeting for the given name, falling back to `"world"` when the name
 * is empty or only whitespace.
 */
export function greet({ name }: GreetOptions): string {
  const target = name.trim();

  return `Hello, ${target.length > 0 ? target : "world"}!`;
}
