import {
  Show,
  SimpleShowLayout,
  BooleanField,
  TextField,
  ArrayField,
  Datagrid,
  DateField,
  ImageField,
  SingleFieldList,
} from 'react-admin'

export const PostShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="post.content" />
      <ArrayField source="post.images">
        <SingleFieldList>
          <ImageField source="url" />
        </SingleFieldList>
      </ArrayField>
      <ArrayField source="post.comments">
        <Datagrid>
          <TextField source="content" />
        </Datagrid>
      </ArrayField>
      <BooleanField source="post.banned" />
      <ArrayField source="post.reports">
        <Datagrid>
          <TextField source="reason" />
          <DateField source="createdAt" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
)
