import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  ArrayField,
  useListContext,
} from 'react-admin'
import { CustomBanButton } from '../components'
import { Fragment } from 'react'

const CustomBulkActions = (props) => (
  <Fragment>
    <CustomBanButton label="Ban" model={'post'} {...props} />
  </Fragment>
)

const LengthField = (props) => {
  const { ids, loaded } = useListContext(props)

  return loaded ? ids.length : null
}

export const PostList = (props) => (
  <List
    {...props}
    rowClick="show"
    perPage={100}
    bulkActionButtons={<CustomBulkActions />}
  >
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="_doc.user" />
      <TextField source="_doc.createdAt" />
      <BooleanField source="_doc.banned" />
      <ArrayField source="_doc.likes">
        <LengthField />
      </ArrayField>
      <ArrayField source="_doc.reports">
        <LengthField />
      </ArrayField>
    </Datagrid>
  </List>
)
