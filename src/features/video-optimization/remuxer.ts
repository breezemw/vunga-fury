export function buildLosslessRemuxCommand(inputPath: string, outputPath: string) {
  return ['-i', inputPath, '-map', '0', '-c', 'copy', '-movflags', '+faststart', outputPath]
}
