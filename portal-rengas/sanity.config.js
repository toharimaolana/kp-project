import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import AnalyticsTool from './src/tools/Analytics'

export default defineConfig({
  name: 'default',
  title: 'SDN Rangas',

  projectId: '15u6dn8p',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('SDN Rangas')
          .items([
            S.listItem()
              .id('analytics')
              .title('Analytics')
              .child(
                S.component({
                  id: 'analytics-dashboard',
                  title: 'Analytics',
                  component: AnalyticsTool,
                }),
              ),
            ...S.documentTypeListItems(),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
