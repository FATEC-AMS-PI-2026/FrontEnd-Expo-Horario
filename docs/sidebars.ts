import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  designSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Design Tokens',
      items: ['colors', 'typography', 'spacing'],
    },
  ],
  componentsSidebar: [
    'components/overview',
    {
      type: 'category',
      label: 'Formulários',
      items: ['components/button', 'components/input', 'components/switch'],
    },
    {
      type: 'category',
      label: 'Display',
      items: ['components/card', 'components/badge', 'components/tabs', 'components/accordion'],
    },
  ],
};

export default sidebars;
