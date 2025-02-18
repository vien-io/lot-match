<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('reviews'); // Drop the table if it exists
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); 
            $table->unsignedBigInteger('block_id')->nullable(); 
            $table->unsignedBigInteger('lot_id'); 
            $table->string('user_name'); 
            $table->timestamps(); 

            // Foreign Key Constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('block_id')->references('id')->on('blocks')->onDelete('cascade');
            $table->foreign('lot_id')->references('id')->on('lots')->onDelete('cascade'); // Foreign key for lot_id
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
