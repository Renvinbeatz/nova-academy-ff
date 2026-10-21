import content from '../../../data/course.json';

export const dynamic = 'force-static';

export function GET() {
  return Response.json({content, canEdit: false});
}
