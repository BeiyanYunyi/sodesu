import type { JSX, ParentComponent } from 'solid-js';

const CommonButton: ParentComponent<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <button
    class="mb-0 ms-3 inline-block min-w-10 cursor-pointer touch-manipulation select-none border border-sBorder rounded-lg border-solid bg-transparent px-4 py-2 text-center text-xs text-sColor transition duration-400 disabled:cursor-not-allowed disabled:cursor-not-allowed disabled:border-sBorder hover:border-sTheme disabled:bg-sDisableBg disabled:text-sDisable disabled:text-sDisable hover:text-sTheme disabled:hover:border-sBorder disabled:hover:bg-sDisableBg disabled:hover:text-sDisable"
    {...props}
  >
    {props.children}
  </button>
);

export default CommonButton;
