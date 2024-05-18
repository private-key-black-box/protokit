"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

export interface SwapProps {
  wallet?: string;
  loading: boolean;
  onConnectWallet: () => void;
  onSwap: (fromToken: string, toToken: string, amount: number) => void;
}

export function Swap({ wallet, onConnectWallet, onSwap, loading }: SwapProps) {
  const form = useForm();

  const handleSubmit = async (data: any) => {
    if (wallet) {
      const fromToken = data.fromToken;
      const toToken = data.toToken;
      const amount = parseInt(data.amount, 10);

      onSwap(fromToken, toToken, amount);
    } else {
      onConnectWallet();
    }
  };

  return (
    <Card className="w-full p-4">
      <Form {...form}>
        <CardHeader>
          <CardTitle>Swap Tokens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            name="fromToken"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>From</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="mina">MINA</option>
                    <option value="dai">DAI</option>
                    <option value="btc">BTC</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="toToken"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>To</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="mina">MINA</option>
                    <option value="dai">DAI</option>
                    <option value="btc">BTC</option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="amount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="100" />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter>
          <Button
            size="lg"
            type="submit"
            className="mt-6 w-full"
            loading={loading}
            onClick={form.handleSubmit(handleSubmit)}
          >
            {wallet ? "Swap" : "Connect Wallet"}
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
}
