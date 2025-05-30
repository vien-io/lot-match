<?php

// database/migrations/xxxx_xx_xx_xxxxxx_create_lots_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLotsTable extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('lots')) {
            Schema::create('lots', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->text('description');
                $table->float('size');
                $table->decimal('price', 10, 2);
                $table->unsignedBigInteger('block_id'); // Add block_id column
                $table->timestamps();

                // Foreign key to blocks
                $table->foreign('block_id')->references('id')->on('blocks')->onDelete('cascade');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('lots');
    }
}
