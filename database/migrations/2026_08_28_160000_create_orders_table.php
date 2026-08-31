<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();
            $table->string('token', 64)->unique();
            $table->string('email');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->string('street');
            $table->string('address2')->nullable();
            $table->string('postal_code');
            $table->string('city');
            $table->string('district');
            $table->string('country')->default('España');
            $table->string('nif')->nullable();
            $table->string('payment');
            $table->boolean('newsletter')->default(false);
            $table->json('items');
            $table->json('shipping')->nullable();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('total', 10, 2);
            $table->decimal('tax', 10, 2);
            $table->string('status')->default('pending_payment');
            $table->timestamp('pay_by')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
