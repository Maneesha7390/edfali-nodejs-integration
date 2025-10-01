export const soap11Headers = (action) => ({
  'Content-Type': 'text/xml; charset=utf-8',
  'SOAPAction': `"http://tempuri.org/${action}"`,
});

export const doPTransEnvelope = ({ Mobile, Pin, Cmobile, Amount, PW }) => `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <DoPTrans xmlns="http://tempuri.org/">
      <Mobile>${escapeXml(Mobile)}</Mobile>
      <Pin>${escapeXml(Pin)}</Pin>
      <Cmobile>${escapeXml(Cmobile)}</Cmobile>
      <Amount>${Amount}</Amount>
      <PW>${escapeXml(PW)}</PW>
    </DoPTrans>
  </soap:Body>
</soap:Envelope>`;

export const onlineConfEnvelope = ({ Mobile, Pin, sessionID, PW }) => `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <OnlineConfTrans xmlns="http://tempuri.org/">
      <Mobile>${escapeXml(Mobile)}</Mobile>
      <Pin>${escapeXml(Pin)}</Pin>
      <sessionID>${escapeXml(sessionID)}</sessionID>
      <PW>${escapeXml(PW)}</PW>
    </OnlineConfTrans>
  </soap:Body>
</soap:Envelope>`;

function escapeXml(v = '') {
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
