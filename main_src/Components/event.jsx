import React from 'react';
import {
  Card,
  CardMedia,
  CardTitle,
  CardText,
} from 'material-ui/Card';

const Event = ({ event, handleEventClick }) => (
  <Card
    onClick={() => {
      handleEventClick(event);
    }}
  >
    <CardMedia
      overlay={<CardTitle title={event.name} subtitle={event.description} />}
    >
      <img style={{ height: '400px', width: '150px' }} src={event.img} alt="" />
    </CardMedia>
    <CardTitle title="" subtitle="" />
    <CardText>{/* {event.description} */}</CardText>
  </Card>
);

export default Event;
