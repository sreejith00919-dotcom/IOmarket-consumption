/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FairgateShell } from './components/Layout';
import { ConsumptionDashboard } from './components/ConsumptionDashboard';

export default function App() {
  return (
    <FairgateShell>
      <ConsumptionDashboard />
    </FairgateShell>
  );
}
