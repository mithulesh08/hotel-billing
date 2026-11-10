export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Get all bills
    if (url.pathname === "/api/bills" &&
        request.method === "GET") {

      const { results } = await env.DB
        .prepare("SELECT * FROM bills ORDER BY id DESC")
        .all();

      return Response.json(results);
    }

    // Save a new bill
    if (url.pathname === "/api/bills" &&
        request.method === "POST") {

      const bill = await request.json();

      if (!bill.invoice_no || !bill.customer_name ||
          bill.subtotal == null || bill.total == null) {
        return Response.json(
          { error: "Missing required bill details" },
          { status: 400 }
        );
      }

      const result = await env.DB.prepare(`
        INSERT INTO bills
        (invoice_no, customer_name, phone,
         service_type, table_room_no, subtotal,
         discount, total, payment_mode,
         payment_status, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        bill.invoice_no,
        bill.customer_name,
        bill.phone || null,
        bill.service_type || null,
        bill.table_room_no || null,
        bill.subtotal,
        bill.discount || 0,
        bill.total,
        bill.payment_mode || null,
        bill.payment_status || "PENDING",
        bill.created_by || null
      ).run();

      return Response.json({
        success: true,
        message: "Bill saved",
        id: result.meta.last_row_id
      });
    }

    return env.ASSETS.fetch(request);
  }
};
