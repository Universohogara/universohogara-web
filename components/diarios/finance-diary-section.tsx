
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, TrendingDown, PiggyBank, Wallet, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FinanceTracker } from './finance-tracker';

interface FinanceEntry {
  id: string;
  date: Date;
  type: 'income' | 'expense' | 'saving' | 'investment';
  amount: number;
  category: string;
  description: string;
  paymentMethod?: string;
  recurring?: boolean;
}

export function FinanceDiarySection() {
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    type: 'income' | 'expense' | 'saving' | 'investment';
    amount: string;
    category: string;
    description: string;
    paymentMethod: string;
    recurring: boolean;
  }>({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    paymentMethod: '',
    recurring: false,
  });

  const categories = {
    income: ['Salario', 'Freelance', 'Inversiones', 'Regalo', 'Otro'],
    expense: ['Comida', 'Transporte', 'Vivienda', 'Entretenimiento', 'Salud', 'Ropa', 'Educación', 'Otro'],
    saving: ['Emergencias', 'Viaje', 'Compra', 'Retiro', 'Otro'],
    investment: ['Acciones', 'Bonos', 'Crypto', 'Inmuebles', 'Otro'],
  };

  const paymentMethods = ['Efectivo', 'Tarjeta Débito', 'Tarjeta Crédito', 'Transferencia', 'Otro'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: FinanceEntry = {
      id: Date.now().toString(),
      date: new Date(),
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      paymentMethod: formData.paymentMethod || undefined,
      recurring: formData.recurring,
    };
    setEntries([newEntry, ...entries]);
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      paymentMethod: '',
      recurring: false,
    });
    setShowForm(false);
  };

  const totalIncome = entries
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = entries
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = entries
    .filter((e) => e.type === 'saving')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalInvestments = entries
    .filter((e) => e.type === 'investment')
    .reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-8">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-6 text-center border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-green-600">€{totalIncome.toFixed(2)}</div>
          <div className="text-sm text-gray-600 mt-1">Ingresos</div>
        </Card>

        <Card className="p-6 text-center border-2 border-red-200 bg-gradient-to-br from-red-50 to-white">
          <TrendingDown className="w-8 h-8 mx-auto mb-2 text-red-600" />
          <div className="text-2xl font-bold text-red-600">€{totalExpenses.toFixed(2)}</div>
          <div className="text-sm text-gray-600 mt-1">Gastos</div>
        </Card>

        <Card className="p-6 text-center border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <Wallet className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold text-blue-600">€{balance.toFixed(2)}</div>
          <div className="text-sm text-gray-600 mt-1">Balance</div>
        </Card>

        <Card className="p-6 text-center border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <PiggyBank className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <div className="text-2xl font-bold text-purple-600">€{totalSavings.toFixed(2)}</div>
          <div className="text-sm text-gray-600 mt-1">Ahorros</div>
        </Card>

        <Card className="p-6 text-center border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
          <DollarSign className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
          <div className="text-2xl font-bold text-yellow-600">€{totalInvestments.toFixed(2)}</div>
          <div className="text-sm text-gray-600 mt-1">Inversiones</div>
        </Card>
      </div>

      {/* Botón para agregar entrada */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowForm(!showForm)}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Transacción
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-blue-200 shadow-xl"
        >
          <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-600" />
            Registrar Transacción
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'income' | 'expense' | 'saving' | 'investment') =>
                    setFormData({ ...formData, type: value, category: '' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">💚 Ingreso</SelectItem>
                    <SelectItem value="expense">❤️ Gasto</SelectItem>
                    <SelectItem value="saving">💙 Ahorro</SelectItem>
                    <SelectItem value="investment">💛 Inversión</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Cantidad (€) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[formData.type].map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pago</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentMethod: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Opcional" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                placeholder="Describe esta transacción..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recurring"
                checked={formData.recurring}
                onChange={(e) =>
                  setFormData({ ...formData, recurring: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="recurring" className="cursor-pointer">
                Transacción recurrente (mensual)
              </Label>
            </div>

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Guardar Transacción
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lista de entradas */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-gray-800 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-600" />
          Historial de Transacciones
        </h3>

        {entries.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2">
            <div className="text-6xl mb-4">💰</div>
            <p className="text-lg text-gray-500 mb-2">
              Aún no hay transacciones registradas
            </p>
            <p className="text-sm text-gray-400">
              Comienza a registrar tus finanzas para tener control total
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`p-6 hover:shadow-lg transition-shadow border-l-4 ${
                    entry.type === 'income'
                      ? 'border-l-green-500'
                      : entry.type === 'expense'
                      ? 'border-l-red-500'
                      : entry.type === 'saving'
                      ? 'border-l-purple-500'
                      : 'border-l-yellow-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          className={
                            entry.type === 'income'
                              ? 'bg-green-100 text-green-700'
                              : entry.type === 'expense'
                              ? 'bg-red-100 text-red-700'
                              : entry.type === 'saving'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }
                        >
                          {entry.type === 'income'
                            ? '💚 Ingreso'
                            : entry.type === 'expense'
                            ? '❤️ Gasto'
                            : entry.type === 'saving'
                            ? '💙 Ahorro'
                            : '💛 Inversión'}
                        </Badge>
                        <Badge variant="secondary">{entry.category}</Badge>
                        {entry.recurring && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            🔄 Recurrente
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-semibold text-lg text-gray-800 mb-1">
                        {entry.description}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          {entry.date.toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        {entry.paymentMethod && (
                          <span>• {entry.paymentMethod}</span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`text-3xl font-bold ${
                        entry.type === 'income'
                          ? 'text-green-600'
                          : entry.type === 'expense'
                          ? 'text-red-600'
                          : entry.type === 'saving'
                          ? 'text-purple-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {entry.type === 'expense' ? '-' : '+'}€{entry.amount.toFixed(2)}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
