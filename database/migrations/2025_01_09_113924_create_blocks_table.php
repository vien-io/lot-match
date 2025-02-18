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
        Schema::create('blocks', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Name of the block
            $table->unsignedBigInteger('subdivision_id')->nullable(); // Subdivision ID
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('subdivision_id')->references('id')->on('subdivisions')->onDelete('cascade');

            // Optional: Index for better performance on foreign keys
            $table->index('subdivision_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blocks');
    }
};
