import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom';
import MultiStepForm from './pages/Form/MultiStepForm';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" element={<MultiStepForm />} />
      </Switch>
    </BrowserRouter>
  );
}