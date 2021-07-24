import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import { Container, Button, Form, Modal, Table } from "react-bootstrap";
import { useLazyQuery, gql } from "@apollo/client";

const getTags = gql`
  query tags($tagger: Bytes!, $hashtag: String!) {
    tags(where: { tagger: $tagger, hashtag: $hashtag }) {
      tagger
      id
      hashtagId
      hashtagDisplayHashtag
      hashtag
      nftImage
      nftName
      nftDescription
      timestamp
    }
  }
`;

export default function App() {
  const [walletAddress, setWalletAddress] = React.useState(null);
  const [hashtag, setHashtag] = React.useState(null);
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [lazyReturn, { loading, data }] = useLazyQuery(getTags);

  function FindTags(event) {
    event.preventDefault();
    console.log(walletAddress);
    console.log(hashtag);
    console.log(loading);
    lazyReturn({ variables: { tagger: walletAddress, hashtag: hashtag },  fetchPolicy: 'no-cache' });
    console.log(data);
    if (!loading) {
      BuildTable(data);
    }
    handleShow();
  }

  function BuildTable(tableData) {
      return (
        <Table show={show}>
            <thead>
              <tr>
                <th>Image</th>
                <th>ID</th>
                <th>HashTag</th>
                <th>Tagger</th>
                <th>Tag Date</th>
              </tr>
              </thead>
        <tbody>
          {data && data.tags.map((rows) => (
            <tr>
              <td><img width="125px" height="125px" src={rows.nftImage} alt="Italian Trulli"/></td>
              <td>{rows.nftName}</td>
              <td>{rows.hashtag}</td>
              <td>{rows.nftDescription}</td>
              <td>{rows.timestamp}</td>
            </tr>
          ))}
        </tbody>
          </Table>
      );
  }

  return (
    <Container className="p-3">
      <Form onSubmit={FindTags}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Wallet Address</Form.Label>
          <Form.Control
            onChange={(e) => setWalletAddress(e.target.value)}
            type="text"
            placeholder="Wallet Address"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>HashTag</Form.Label>
          <Form.Control
            onChange={(e) => setHashtag(e.target.value)}
            type=""
            placeholder="HashTag"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Find Hashtags
        </Button>
      </Form>
        <BuildTable />
    </Container>
  );
}
