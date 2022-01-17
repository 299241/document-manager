import PropTypes from 'prop-types';
// material
import { Card, Typography, CardHeader, CardContent, List } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator,
  TimelineDot
} from '@mui/lab';
// utils
import { fDateTime } from '../../utils/formatTime';

// ----------------------------------------------------------------------

EventItem.propTypes = {
  item: PropTypes.object,
  isLast: PropTypes.bool
};

EventsTimeline.propTypes = {
  events: PropTypes.array
};

function EventItem({ item, isLast }) {
  const { type, title, time } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            bgcolor:
              (type === 'created' && 'gray[800]') ||
              (type === 'signed' && 'success.main') ||
              (type === 'opened' && 'info.main') ||
              (type === 'signers' && 'warning.main') ||
              (type === 'sent' && 'secondary.main') ||
              (type === 'name' && 'primary.main') ||
              'error.main'
          }}
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2" sx={{ wordBreak: 'break-word' }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fDateTime(time)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

export default function EventsTimeline({ events }) {
  const timeline = [];
  if (events.length) {
    // eslint-disable-next-line no-restricted-syntax
    for (const e of events) {
      if (e.event !== 'DocumentRequiresSignature') {
        switch (e.event) {
          case 'DocumentCreated':
            timeline.push({
              type: 'created',
              title: 'Document created',
              time: e.timestamp,
              id: e.id
            });
            break;
          case 'DocumentSigned':
            timeline.push({
              type: 'signed',
              title: (
                <p>
                  Document signed by <i>{e.returnValues[1]}</i>
                </p>
              ),
              time: e.timestamp,
              id: e.id
            });
            break;
          case 'DocumentOpened':
            timeline.push({
              type: 'opened',
              title: (
                <p>
                  Document opened by <i>{e.returnValues[1]}</i>
                </p>
              ),
              time: e.timestamp,
              id: e.id
            });
            break;
          case 'DocumentNameChanged':
            timeline.push({
              type: 'name',
              title: (
                <p>
                  Document name changed from <i>{e.returnValues[1]}</i> to{' '}
                  <i>{e.returnValues[2]}</i>
                </p>
              ),
              time: e.timestamp,
              id: e.id
            });
            break;
          case 'DocumentSignersUpdated':
            timeline.push({
              type: 'signers',
              title: 'Document signers updated',
              time: e.timestamp,
              id: e.id
            });
            break;
          case 'DocumentSent':
            timeline.push({
              type: 'sent',
              title: 'Document sent to signers',
              time: e.timestamp,
              id: e.id
            });
            break;

          default:
        }
      }
    }
  }

  return (
    <Card
      sx={{
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none'
        }
      }}
    >
      <CardHeader sx={{ mb: 2 }} title="Document history" />
      <List
        sx={{
          // width: '100%',
          // maxWidth: 360,
          // bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'auto',
          maxHeight: 540,
          zIndex: 10000
          // '& ul': { padding: 0 },
        }}
      >
        <CardContent sx={{ mt: -4 }}>
          <Timeline>
            {timeline.map((item, index) => (
              <EventItem key={item.id} item={item} isLast={index === timeline.length - 1} />
            ))}
          </Timeline>
        </CardContent>
      </List>
    </Card>
  );
}
