import { Global } from "@emotion/react";

const Fonts = () => (
  <Global
    styles={`
    @font-face {
        font-family: 'Nunito';
        font-weight: 400;
        src: url('/fonts/Nunito/Nunito-Regular.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Nunito';
      font-weight: 600;
      src: url('/fonts/Nunito/Nunito-SemiBold.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Nunito';
      font-weight: 700;
      src: url('/fonts/Nunito/Nunito-Bold.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Nunito';
      font-weight: 800;
      src: url('/fonts/Nunito/Nunito-ExtraBold.ttf') format('truetype');
    }
    @font-face {
      font-family: 'Martian';
      font-weight: 200;
      src        : url('/fonts/Martian/static/MartianMono-ExtraLight.ttf') format('truetype');
  }
  
  @font-face {
      font-family: 'Martian';
      font-weight: 300;
      src        : url('/fonts/Martian/static/MartianMono-Light.ttf') format('truetype');
  }
  
  @font-face {
      font-family: 'Martian';
      font-weight: 500;
      src        : url('/fonts/Martian/static/MartianMono-Medium.ttf') format('truetype');
  }
  
  @font-face {
      font-family: 'Martian';
      font-weight: 600;
      src        : url('/fonts/Martian/static/MartianMono-SemiBold.ttf') format('truetype');
  }
 `}
  />
);

export default Fonts;
