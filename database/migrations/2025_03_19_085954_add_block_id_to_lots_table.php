<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Check if the table 'lots' exists
        if (Schema::hasTable('lots')) {
            // Only proceed if 'block_id' doesn't already exist
            if (!Schema::hasColumn('lots', 'block_id')) {
                Schema::table('lots', function (Blueprint $table) {
                    $table->unsignedBigInteger('block_id')->after('id'); // Adding block_id column
                });
            }
        }
    }

    public function down()
    {
        // Check if the column exists before trying to drop it
        if (Schema::hasColumn('lots', 'block_id')) {
            Schema::table('lots', function (Blueprint $table) {
                $table->dropColumn('block_id'); // Dropping the block_id column
            });
        }
    }
};
