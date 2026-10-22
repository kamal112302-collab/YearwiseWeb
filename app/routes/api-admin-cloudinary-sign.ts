import { requireAdmin } from "../lib/session.server";
import { getCloudinaryCredentials, signCloudinaryParams } from "../lib/cloudinary.server";

async function loader$10({
  request
}) {
  await requireAdmin(request);
  const credentials = getCloudinaryCredentials();
  if (!credentials) return Response.json({
    error: "Cloudinary is not configured."
  }, {
    status: 503
  });
  return Response.json({
    apiKey: credentials.apiKey,
    cloudName: credentials.cloudName
  });
}
async function action$7({
  request
}) {
  await requireAdmin(request);
  if (!getCloudinaryCredentials()) return Response.json({
    error: "Cloudinary is not configured."
  }, {
    status: 503
  });
  const body = await request.json();
  const {
    signature
  } = signCloudinaryParams(body.paramsToSign ?? body);
  return Response.json({
    signature
  });
}

export { action$7 as action, loader$10 as loader };
