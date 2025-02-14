import Announcement from './Announcement';
import Article from './Article';
import Event from './Event';
import Gallery from './Gallery';
import Issue from './Issue';
import Person from './Person';
import Promo from './Promo';
import Term from './Term';
import Video from './Video';

export default {
  announcement: Announcement,
  article: Article,
  channel: Term,
  department: Term,
  division: Term,
  event: Event,
  event_category: Term,
  faculty_expert: Person,
  faculty_expert_topics: Term,
  gallery: Gallery,
  gazette_article: Article,
  issue: Issue,
  location: Term,
  magazine_article: Article,
  media_rep: Person,
  person: Person,
  promo: Promo,
  summary: Article,
  tag: Term,
  topic: Term,
  remotely_hosted_video: Video,
};
