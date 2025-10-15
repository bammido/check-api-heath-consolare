import { ApiHealth } from '@/types/apiHealth';
import { NextResponse } from 'next/server';

export async function GET() {
  let response: ApiHealth[] | null = null;

  try {
    const [
      portalHmlStatus,
      portalPrdStatus,
      payHmlStatus,
      payPrdStatus,
      vindiHmlStatus,
      vindiPrdStatus,
      tefHmlStatus,
      tefPrdStatus
    ] = await Promise.all([
      checkPortalVendas({ environment: 'hml' }),
      checkPortalVendas({ environment: 'prd' }),
      checkConsolarePay({ environment: 'hml' }),
      checkConsolarePay({ environment: 'prd' }),
      checkVindi({ environment: 'hml' }),
      checkVindi({ environment: 'prd' }),
      checkTEF({ environment: 'hml' }),
      checkTEF({ environment: 'prd' })
    ]);

    response = [
      portalHmlStatus,
      portalPrdStatus,
      payHmlStatus,
      payPrdStatus,
      vindiHmlStatus,
      vindiPrdStatus,
      tefHmlStatus,
      tefPrdStatus
    ];
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json(response);
}

async function checkPortalVendas({
  environment
}: {
  environment: 'prd' | 'hml';
}): Promise<ApiHealth> {
  const response = await fetch(
    `${
      environment === 'prd'
        ? process.env.PORTAL_VENDAS_URL_PRD!
        : process.env.PORTAL_VENDAS_URL_HML!
    }/actuator/health`,
    {
      headers: {
        'x-auth-token':
          environment === 'prd'
            ? process.env.PORTAL_VENDAS_TOKEN_PRD!
            : process.env.PORTAL_VENDAS_TOKEN_HML!
      }
    }
  );

  return {
    apiName: `portal de vendas ${environment}`,
    healthy: response.ok,
    lastChecked: new Date()
  };
}

async function checkConsolarePay({
  environment
}: {
  environment: 'prd' | 'hml';
}): Promise<ApiHealth> {
  const response = await fetch(
    `${
      environment === 'prd'
        ? process.env.CONSOLARE_PAY_URL_PRD!
        : process.env.CONSOLARE_PAY_URL_HML!
    }/actuator/health`,
    {
      headers: {
        authorization:
          environment === 'prd'
            ? process.env.CONSOLARE_PAY_TOKEN_PRD!
            : process.env.CONSOLARE_PAY_TOKEN_HML!
      }
    }
  );

  return {
    apiName: `consolare pay vindi ${environment}`,
    healthy: response.ok,
    lastChecked: new Date()
  };
}

async function checkVindi({
  environment
}: {
  environment: 'prd' | 'hml';
}): Promise<ApiHealth> {
  const environmentKey =
    environment === 'prd'
      ? process.env.VINDI_API_KEY_PRD!
      : process.env.VINDI_API_KEY_HML!;

  const response = await fetch(
    `${
      environment === 'prd' ? process.env.VINDI_URL_PRD! : process.env.VINDI_URL_HML!
    }/api/v1/products`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${environmentKey}:`).toString('base64')}`
      }
    }
  );

  return {
    apiName: `vindi ${environment}`,
    healthy: response.ok,
    lastChecked: new Date()
  };
}

async function checkTEF({
  environment
}: {
  environment: 'prd' | 'hml';
}): Promise<ApiHealth> {
  const response = await fetch(
    `${
      environment === 'prd' ? process.env.TEF_URL_PRD! : process.env.TEF_URL_HML!
    }/live`
  );

  return {
    apiName: `consolare pay TEF ${environment}`,
    healthy: response.ok,
    lastChecked: new Date()
  };
}
