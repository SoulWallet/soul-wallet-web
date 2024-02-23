import { Global } from '@emotion/react';
import NunitoRegular from '@/assets/fonts/Nunito/Nunito-Regular.ttf';
import NunitoSemiBold from '@/assets/fonts/Nunito/Nunito-SemiBold.ttf';
import NunitoBold from '@/assets/fonts/Nunito/Nunito-Bold.ttf';
import NunitoExtraBold from '@/assets/fonts/Nunito/Nunito-ExtraBold.ttf';

const Fonts = () => (
  <Global
    styles={`
    @font-face {
        font-family: 'Nunito';
        font-weight: 400;
        font-swap: block;
        src: url(${NunitoRegular});
    }
    @font-face {
      font-family: 'Nunito';
      font-weight: 600;
      font-swap: block;
      src: url(${NunitoSemiBold});
    }
    @font-face {
      font-family: 'Nunito';
      font-weight: 700;
      font-swap: block;
      src: url(${NunitoBold});
    }
    @font-face {
      font-family: 'Nunito';
      font-weight: 800;
      font-swap: block;
      src: url(${NunitoExtraBold});
    }
 `}
  />
);

export default Fonts;
