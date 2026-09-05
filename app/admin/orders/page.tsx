'use client';

import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import { getOrders } from '@/lib/supabase/api';
import { updateOrderStatusAction } from '@/app/actions/orders';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    const result = await updateOrderStatusAction(orderId, newStatus);
    setUpdatingId(null);

    if (result.success) {
      setSuccessMessage(`Order status updated to "${newStatus}" in database.`);
      setTimeout(() => setSuccessMessage(''), 3500);
      await fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    }
  };

  const statusOptions: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Processing',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Order Management</h2>
        <p className="text-xs text-slate-500 font-mono">Manage customer doorstep milk delivery orders</p>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Orders List Table */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono">
                  <th className="py-3 px-4 font-semibold">Order #</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Area</th>
                  <th className="py-3 px-4 font-semibold">Total</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{ord.order_number}</td>
                    <td className="py-3.5 px-4 text-slate-800">
                      <div>{ord.customer_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{ord.customer_phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{ord.area_name}</div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {ord.delivery_slot === 'Evening' ? '🌙 Evening' : '☀️ Morning'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">Rs. {ord.total_amount}</td>
                    <td className="py-3.5 px-4">
                      <select
                        disabled={updatingId === ord.id}
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                        className="px-2 py-1 rounded-lg border border-slate-300 text-[10px] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Drawer Card */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 sticky top-24">
          <h3 className="font-bold text-slate-900 text-base">
            {selectedOrder ? `Order: ${selectedOrder.order_number}` : 'Select an Order'}
          </h3>

          {selectedOrder ? (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900">{selectedOrder.customer_name}</div>
                <div className="text-slate-600">{selectedOrder.customer_email}</div>
                <div className="text-slate-600">{selectedOrder.customer_phone}</div>
                <div className="text-slate-700 font-semibold pt-1 border-t border-slate-200 mt-1">
                  {selectedOrder.delivery_address}, {selectedOrder.area_name}
                </div>
                <div className="pt-0.5">
                  <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Slot: {selectedOrder.delivery_slot === 'Evening' ? '🌙 Evening Delivery' : '☀️ Morning Delivery'}
                  </span>
                </div>
                {selectedOrder.delivery_notes && (
                  <div className="text-[11px] text-amber-700 italic pt-1">
                    Note: &ldquo;{selectedOrder.delivery_notes}&rdquo;
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[11px] mb-2 font-mono">
                  Purchased Items Snapshot
                </h4>
                <div className="space-y-2 border-t border-b border-slate-200 py-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-700">
                      <div>
                        <div className="font-semibold text-slate-900">{item.product_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.quantity} × Rs. {item.product_price}
                        </div>
                      </div>
                      <div className="font-bold text-slate-900">Rs. {item.subtotal}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1 font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>Rs. {selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Fee:</span>
                  <span>Rs. {selectedOrder.delivery_fee}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
                  <span>Total Amount:</span>
                  <span className="text-emerald-600">Rs. {selectedOrder.total_amount}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              Click the eye icon next to any order in the table to view customer details and item snapshots.
            </p>
          )}
        </div>

      </div>

    </div>
  );
}
