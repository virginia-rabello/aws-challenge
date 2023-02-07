import {
    Card,
    View,
    TextField,
    Button,
    TextAreaField,
    Heading,
    Icon,
    Flex
  } from '@aws-amplify/ui-react';
  import { API, Storage } from 'aws-amplify';
  import {
    createNote as createNoteMutation,
  } from "../../graphql/mutations";
  export const CreateSlideModal = ({createSlideModalOpen, toggleCreateSlideModal}) => {
    async function createNote(event) {
        event.preventDefault();
        const form = new FormData(event.target);
        const image = form.get("image");
        const data = {
          name: form.get("name"),
          description: form.get("description"),
          image: image.name,
        };
        if (!!data.image) await Storage.put(data.name, image);
        await API.graphql({
          query: createNoteMutation,
          variables: { input: data },
        });
        event.target.reset();
      }

    return (
      <View
      as="div"
      ariaLabel="View example"
      backgroundColor="var(--amplify-colors-white)"
      borderRadius="6px"
      border="1px solid var(--amplify-colors-black)"
      boxShadow="3px 3px 5px 6px var(--amplify-colors-neutral-60)"
      color="var(--amplify-colors-blue-60)"
      maxWidth="100%"
      padding="1rem"
      width="500px" 
      position="absolute"
      left="30%"
      top="10%"
      >
        <Card>
        <Flex
            direction="row"
            justifyContent="flex-end"
            >
        <Icon
            onClick={() => toggleCreateSlideModal(!createSlideModalOpen)}
            ariaLabel="Close"
            pathData="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
            />
            </Flex>  
            <Heading level={4}>Create Slide</Heading>
          <View as="form" onSubmit={createNote}>
            <TextField
                margin="20px"
                name="name"
                placeholder="Slide Name"
                label="Slide Name"
                required
            />
            <TextAreaField
                margin="20px"
                name="description"Slide Name
                placeholder="Slide Description"
                label="Slide Description"
                required
            />
            <View
                margin="20px"
                name="image"
                as="input"
                type="file"
                style={{ alignSelf: "end" }}
            />
            <Button marginTop="20px" type="submit" variation="primary">
                Create Slide
            </Button>
        </View>
        </Card>
      </View>
    );
  };