import { Outlet } from 'react-router-dom';
import CommonWrapper from './CommonWrapper';

export default function PublicWrapper() {
  return (
    <CommonWrapper>
      <Outlet />
    </CommonWrapper>
  );
}
