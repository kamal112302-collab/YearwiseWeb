import { destroyAdminSession } from "../lib/session.server";

async function action({
  request
}) {
  return destroyAdminSession(request);
}
async function loader({
  request
}) {
  return destroyAdminSession(request);
}

export { action, loader };
