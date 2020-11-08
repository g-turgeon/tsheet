import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  :root {
    --cool-gray100: #ffffff;
    --cool-gray200: #ededf3;
    --cool-gray300: #dfdfe4;
    --cool-gray400: #c5c5c9;
    --cool-gray500: #85848f;
    --cool-gray600: #767580;
    --cool-gray700: #565466;
    --cool-gray800: #2b2c40;
    --cool-gray900: #090e23;

    --background: #141d35;
    --foreground: #b3cde9;

    --normal-black: #1c294b;
    --normal-red: #d14471;
    --normal-green: #94ce70;
    --normal-yellow: #ccbf69;
    --normal-blue: #1fbeec;
    --normal-magenta: #9a62d0;
    --normal-cyan: #4eced3;
    --normal-white: #8395c5;

    --light-black: #3a4c7b;
    --light-red: #ce6685;
    --light-green: #97dc89;
    --light-yellow: #c9d284;
    --light-blue: #1fd0f7;
    --light-magenta: #9289db;
    --light-cyan: #58dbe0;
    --light-white: #b3cde9;

    --accent: var(--light-blue);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    border: none;
    outline: none;
    background: transparent;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
  }

  body {
    font-size: 12px;
    font-family: Cantarell, sans-serif;
    background-color: var(--background);
    color: var(--foreground);
    overflow: hidden;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;

    &-track {
      background: var(--normal-black);
    }

    &-thumb {
      background: var(--light-black);
    }
  }
`
