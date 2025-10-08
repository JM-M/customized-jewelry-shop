declare module "autosize-input" {
  function autosize(input: HTMLInputElement): (() => void) | undefined;
  export default autosize;
}
