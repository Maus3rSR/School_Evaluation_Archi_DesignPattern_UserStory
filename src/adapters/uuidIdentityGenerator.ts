export function* UUIDGenerator(): IterableIterator<string> {
  while (true) {
    yield crypto.randomUUID();
  }
}
