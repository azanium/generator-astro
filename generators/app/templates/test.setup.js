import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

if (process.env.NODE_ENV === 'test') {
  process.env.REZA_PUBLIC_DIR = './public';
}
